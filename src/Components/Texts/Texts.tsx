import React from 'react'

type TextProps={
    variant:string,
    className?:string,
    style?:React.CSSProperties,
    children:React.ReactNode
}

export const Texts:React.FC<TextProps> = ({variant,className,style,children}) => {
  if(variant === "h1") 
    return <h1 className={className} style={style}>{children}</h1>
  if(variant === "h2")
    return <h2 className={className} style={style}>{children}</h2>
  if(variant === "p")
    return <p className={className} style={style}>{children}</p>
  if(variant === "span")
    return <span className={className} style={style}>{children}</span>  
  return (
    <div className={className} style={style}>{children}</div>
  )
}
