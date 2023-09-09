import { useState } from 'react'
import Router from 'next/router'

import useRequest from '../hooks/use-request'

export default () => {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const { doRequest, errors } = useRequest({
        url: '/api/users/signup',
        method: 'post',
        body: {
            email,
            password,
        },
        onSuccess: () => Router.push('/'),
    })

    const onSubmit = (e) => {
        e.preventDefault()
        doRequest()
    }

    return (
        <form onSubmit={onSubmit}>
            <h1>Sign Up</h1>
            <div className="form-group">
                <label>Email address:</label>
                <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label>Password:</label>
                <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type="password"
                    className="form-control"
                />
            </div>
            <div>{errors}</div>
            <button className="btn btn-primary">Sign Up</button>
        </form>
    )
}
