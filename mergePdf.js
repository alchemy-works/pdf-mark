import { PDFDocument } from 'pdf-lib'
import { saveAs } from 'file-saver'


export default async function mergePdf(templateFile, targetFileList, pageIndex = 0) {
    const templateDoc = await PDFDocument.load(await templateFile.arrayBuffer())
    for (const targetFile of targetFileList) {
        const filename = targetFile.name
        const targetDoc = await PDFDocument.load(await targetFile.arrayBuffer())
        const [templatePage] = await targetDoc.copyPages(templateDoc, [0])
        targetDoc.insertPage(pageIndex, templatePage)
        const bytes = await targetDoc.save()
        saveAs(new Blob([bytes], { type: 'application/octet-stream' }), `mark-${filename}`)
    }
}