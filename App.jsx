import React, { useState } from 'react'
import { css } from '@emotion/css'
import mergePdf from './mergePdf.js'

const ClassName = css`
  box-sizing: border-box;
  height: 100vh;
  padding: 1rem;
  margin: 0 auto;
  max-width: 1000px;

  .select-block {
    box-sizing: border-box;
    padding: 1rem;
    border: 1px solid #ccc;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .none-border-top {
    border-top: none;
  }

  input[type=file] {
    border: 2px dashed #ccc;
    padding: 1rem;
    cursor: pointer;
    border-radius: 2px;
    flex: none;
  }

  button[type=submit] {
    min-height: 2rem;
    cursor: pointer;
  }

  input[type=number] {
    height: 1.5rem;
    font-size: 1rem;
    width: 4rem;
  }

  .none-border {
    border: none;
  }

  .none-padding {
    padding: 0;
  }
`

export default function App(props) {

    const [processing, setProcessing] = useState(false)
    const [processingFileNo, setProcessingFileNo] = useState(0)

    async function onSubmit(ev) {
        ev.preventDefault()
        try {
            setProcessing(true)
            const form = new FormData(ev.target)
            const index = form.get('index')
            const pageIndex = Math.trunc(Number(index)) - 1
            await mergePdf({
                templateFile: form.get('template'),
                targetFileList: form.getAll('targets'),
                pageIndex: pageIndex >= 0 ? pageIndex : 0,
                prefix: form.get('prefix'),
                progressCallback: (no) => {
                    setProcessingFileNo(no)
                },
            })
        } catch (err) {
            alert(err.message)
        } finally {
            setProcessing(false)
            setProcessingFileNo(0)
        }
    }

    return (
        <form className={ClassName} onSubmit={onSubmit}>
            <h1>
                PDF水印页添加小工具
            </h1>
            <div className="select-block">
                <label htmlFor="template">请选择需要添加的水印页模板PDF</label>
                <input id="template" name="template" type="file" accept=".pdf" required/>
            </div>
            <div className="select-block none-border-top">
                <label htmlFor="targets">请选择需要处理的PDF（可多选）</label>
                <input id="targets" name="targets" type="file" multiple accept=".pdf" required/>
            </div>
            <div className="select-block none-border-top">
                <span className="select-block none-border none-padding">
                    <label>
                        添加位置&nbsp;&nbsp;
                        <input type="number" name="index" defaultValue={1}/>
                    </label>
                    <label>
                        文件名称前缀&nbsp;&nbsp;
                        <input type="text" name="prefix" defaultValue="Mark-" required/>
                    </label>
                </span>
                {processing ? (
                    <button disabled type="submit">
                        正在处理{processingFileNo ? `第${processingFileNo}个文件...` : '...'}
                    </button>
                ) : (
                    <button type="submit">
                        开始处理
                    </button>
                )}
            </div>
        </form>
    )
}