import Link from 'next/link'

export default ({ currentUser }) => {
    const links = [
        !currentUser && { label: 'Sign Up', href: '/signup' },
        !currentUser && { label: 'Sign In', href: '/signin' },
        currentUser && { label: 'Sign Out', href: '/signout' },
    ]
        .filter((linkConfig) => linkConfig)
        .map(({ label, href }) => {
            return (
                <li key={href} className="nav-item">
                    <Link href={href}>
                        <a className="nav-link">{label}</a>
                    </Link>
                </li>
            )
        })

    return (
        <nav className="navbar navbar-light bg-light">
            <Link href="/">
                <a href="">GitTIx</a>
            </Link>
            <div className="d-flex justify-content-end">
                <ul className="nav d-flex align-items-center">{links}</ul>
            </div>
        </nav>
    )
}
