import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer>
            <p>Copyright &copy; 2021</p>
            <Link to="/">Interview Tracker</Link>
            &nbsp;|&nbsp;
            <Link to="/drag">Drag & Drop</Link>
            &nbsp;|&nbsp;
            <Link to="/about">About</Link>
            
        </footer>
    )
}

export default Footer
