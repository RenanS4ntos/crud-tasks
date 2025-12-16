import fs from 'node:fs'
import { parse } from 'csv-parse'

const csvPath = new URL('../../tasks.csv', import.meta.url)

const stream = fs.createReadStream(csvPath)

const csvParse = parse({
  columns: true,
  skip_empty_lines: true,
  delimiter: ','
})

async function run() {
  const linesParse = stream.pipe(csvParse)

  for await (const line of linesParse) {
    const { title, description } = line

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
      })
    })

    console.log(`✅ Task imported: ${title}`)
  }

  console.log('\n🎉 Import completed!')
}

run()