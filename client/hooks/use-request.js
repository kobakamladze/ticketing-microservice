import axios from 'axios'
import { useState } from 'react'

export default ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null)

    const doRequest = async () => {
        try {
            setErrors(null)
            const response = await axios[method](url, body)
            if (onSuccess) onSuccess()
            return response.data
        } catch (err) {
            setErrors(
                <ul>
                    {err.response.data.errors.map((err, idx) => (
                        <li key={idx}>
                            {err.message}
                            <br />
                        </li>
                    ))}
                </ul>
            )
            throw err
        }
    }

    return { doRequest, errors }
}
