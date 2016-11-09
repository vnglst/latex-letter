const express = require('express')
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

router.post('/', (req, res) => {
  const timestamp = new Date()
    .getTime()
  const inputFile = `tmp/letter${timestamp}.md`
  const outputFile = `tmp/output${timestamp}.pdf`
  const letterContent = formBodyToMarkDown(req.body)
  fs.writeFile(inputFile, letterContent, () => {
    makePDF(inputFile, outputFile)
    const readStream = fs.createReadStream(outputFile)
    readStream.pipe(res)
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
${content}
`)

module.exports = router
