import { PDFDocument } from 'pdf-lib'
import { saveAs } from 'file-saver'


export default async function mergePdf({
                                           templateFile,
                                           targetFileList,
                                           pageIndex = 0,
                                           prefix = 'Mark-',
                                           progressCallback = () => undefined
                                       }) {
    const templateDoc = await PDFDocument.load(await templateFile.arrayBuffer())
    for (let i = 0; i < targetFileList.length; i++) {
        progressCallback(i + 1)
        const targetFile = targetFileList[i]
        const filename = targetFile.name
        const targetDoc = await PDFDocument.load(await targetFile.arrayBuffer())
        const [templatePage] = await targetDoc.copyPages(templateDoc, [0])
        targetDoc.insertPage(pageIndex, templatePage)
        const bytes = await targetDoc.save()
        saveAs(new Blob([bytes], { type: 'application/octet-stream' }), `${prefix}${filename}`)
    }
}