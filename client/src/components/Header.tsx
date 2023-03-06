import {CSSProperties} from "react"

type HeaderProps = {
	what:string
	where?:string
}

const Header = (props:HeaderProps) => <h1 style={style}>{JSON.stringify(props.what)}</h1>

const style:CSSProperties = {
	backgroundColor: 'rebeccapurple',
	textDecoration: 'underline'
}


export {Header};
