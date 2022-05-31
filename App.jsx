import React, { useState } from 'react'
import { css } from '@emotion/css'
import mergePdf from './mergePdf.js'

const ClassName = css`
  box-sizing: border-box;
  height: 100vh;
  padding: 1rem;

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
`

export default function App(props) {

    const [processing, setProcessing] = useState(false)

    async function onSubmit(ev) {
        ev.preventDefault()
        try {
            setProcessing(true)
            const form = new FormData(ev.target)
            const template = form.get('template')
            const targetList = form.getAll('targets')
            const index = form.getAll('index')
            const pageIndex = Math.trunc(Number(index)) + -1
            await mergePdf(template, targetList, pageIndex >= 0 ? pageIndex : 0)
        } catch (err) {
            alert(err.message)
        } finally {
            setProcessing(false)
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
                <label>
                    添加位置&nbsp;&nbsp;
                    <input type="number" name="index" defaultValue={1}/>
                </label>
                <button disabled={processing} type="submit">
                    {processing ? '正在处理...' : '开始处理'}
                </button>
            </div>
        </form>
    )
}