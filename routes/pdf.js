const express = require('express')
const router = express.Router()
const fs = require('fs')
const exec = require('child_process')
  .exec

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
}) => {
  const markdown = `
---
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
${content}
`

  return markdown
}

router.post('/', (req, res) => {
  const timestamp = new Date()
    .getTime()
  const inputFile = `letters/letter${timestamp}.md`
  const outputFile = `letters/output${timestamp}.pdf`
  const letterContent = formBodyToMarkDown(req.body)
  const cmd = `cd letters; pandoc ${inputFile} -o ${outputFile} --template=template.tex --latex-engine=xelatex`
  fs.writeFile(inputFile, letterContent, () => {
    exec(cmd, (err, stdout, stderr) => {
      if (stderr) return res.send(stderr)
      if (err) return res.send(err)
      const readStream = fs.createReadStream(outputFile)
      readStream.pipe(res)
    })
  })
})

module.exports = router
