import React from 'react'
import { Link } from 'react-router-dom'

import '../../App.css'

export default function ForgetPasswordPage() {
    return (
        <div className="text-center m-5-auto">
            <h2>Slaptažodžio keitimo informacija bus atsiūta į pateiktą elektroninį paštą</h2>
            <form action="/login">
                <p>
                    <label id="reset_pass_lbl">El. paštas</label><br/>
                    <input type="email" name="email" required />
                </p>
                <p>
                    <button id="sub_btn" type="submit">Keisti slaptažodį</button>
                </p>
            </form>
            <footer>
                <p>Neturite paskyros? <Link to="/register">Registruotis</Link>.</p>
                <p><Link to="/">Grįžti</Link>.</p>
            </footer>
        </div>
    )
}
