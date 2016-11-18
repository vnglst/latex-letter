const express = require('express')
const shortid = require('shortid')
const router = express.Router()
const fs = require('fs')
const
  spawn = require('child_process')
  .spawnSync

const cleanup = (inputFile, outputFile) => {
  spawn(`rm`, [inputFile])
  spawn(`rm`, [outputFile])
}

const makePDF = (inputFile, outputFile) => {
  const pandoc = spawn(`pandoc`, [`${inputFile}`,
      `-o`,
      `${outputFile}`,
       `--template=letter/template.tex`,
        `--latex-engine=xelatex`])
  const error = pandoc.stderr.toString()
  if (error) {
    console.log(error)
  }
}

const validateInput = (body) => {
  // "To" fields are required for the LaTeX compiler
  if (!body.to1) return false
  if (!body.to2) return false
  if (!body.to3) return false
  if (!body.to4) return false
  return true
}

// Removes \ from user input string
const sanitize = (input) => {
  return input.replace(String.fromCharCode(92), ``)
}

// Don't allow user to execute code on server using LaTeX
// E.g. \input{/etc/passwd}
// Or even worse: \write18{rm -rf /}
const sanitizeInput = (body) => {
  console.log(body)
  for (let prop in body) {
    body[prop] = sanitize(body[prop])
  }
  console.log(body)
  return body
}

router.post('/', (req, res) => {
  // Make sure user-letters folder exists
  spawn(`mkdir`, [`-p`, `user-letters`])

  const uniqueId = shortid.generate()
  const inputFile = `user-letters/letter-${uniqueId}.md`
  const outputFile = `user-letters/output-${uniqueId}.pdf`

    // Validate user input
  if (!validateInput(req.body)) {
    return res.send(`Incorrect data. "To" form fields cannot be empty.`)
  }

    // Sanitize user input
  const letterContent = formBodyToMarkDown(sanitizeInput(req.body))

  fs.writeFile(inputFile, letterContent, () => {
    makePDF(inputFile, outputFile)
    const readStream = fs.createReadStream(outputFile)
      // Getting file stats
    const stats = fs.statSync(outputFile)
      // Setting file size
    res.setHeader('Content-Length', stats.size)
    res.setHeader('Content-Type', 'application/pdf')
      // Setting file name and type
    res.setHeader('Content-Disposition', 'attachment; filename="letter.pdf"')
    readStream.pipe(res)
      // Cleanup files
    cleanup(inputFile, outputFile)
  })
})

const formBodyToMarkDown = ({
  content,
  subject,
  author,
  city,
  from1,
  from2,
  to1,
  to2,
  to3,
  to4
}) => (`---
subject: ${subject}
author: ${author}
city: ${city}
from:
- ${from1}
- ${from2}
to:
- ${to1}
- ${to2}
- ${to3}
- ${to4}

# Settings
mainfont: Hoefler Text
altfont: Helvetica Neue
monofont: Courier
lang: english
fontsize: 10pt
geometry: a4paper, left=35mm, right=35mm, top=50mm, bottom=25mm
# letterhead: true
# customdate: YYYY-MM-DD
---
${content || standardText}
`)

const standardText = `Dear Friend,

I am a bombardier in the second mounted division of the Fourth Horse Artillery.

You may well imagine how astonished I was by this revolution in my affairs, and what a violent upheaval it has made in my everyday humdrum existence. Nevertheless I have borne the change with determination and courage, and even derive a certain pleasure from this turn of fortune. Now that I have an opportunity of doing a little athletic training I am more than ever thankful to our Schopenhauer. For the first five weeks I had to be in the stables. At 5:30 in the morning I had to be among the horses, removing the manure and grooming the animals down with the currycomb and horse brush. For the present my work lasts on an average from 7 a.m. to 10 a.m. and from 11.30 a.m. to 6 p.m., the greater part of which I spend in parade drill. Four times a week we two soldiers who are to serve for a year have to attend a lecture given by a lieutenant, to prepare us for the reserve officers examination. You must know that in the horse artillery there is a tremendous amount to learn. We get most fun out of the riding lessons. My horse is a very fine animal, and I am supposed to have some talent for riding. When I and my steed gallop round the large parade ground, I feel very contented with my lot. On the whole, too, I am very well treated. Above all, we have a very nice captain.

I have now told you all about my life as a soldier. This is the reason why I have kept you waiting so long for news and for an answer to your last letter. Meanwhile, if I am not mistaken, you will probably have been freed from your military fetters; that is why I thought it would be best to address this letter to Spandau.

But my time is already up; a business letter to Volkmann and another to Ritschl have robbed me of much of it. So I must stop in order to get ready for the parade in full kit.

Well, old man, forgive my long neglect, and hold the god of War responsible for most of it.

Your devoted friend,
`

module.exports = router
