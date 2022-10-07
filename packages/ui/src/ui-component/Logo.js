import logo from 'assets/images/outerbridge_brand.png'

// ==============================|| LOGO ||============================== //

const Logo = () => {
    return (
        <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'row' }}>
            <img style={{ objectFit: 'contain', height: 'auto', width: 150 }} src={logo} alt='Outerbridge' />
        </div>
    )
}

export default Logo
