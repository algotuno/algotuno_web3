import Header from '../components/header/header';
import Footer from '../components/footer/footer';


export default function Layout({children}) {
    return (
        <span style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
        }}>
            <Header/>
            <main style={{flex: 1}}>{children}</main>
            <Footer/>
        </span>
    )
}