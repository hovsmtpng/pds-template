import React from "react"

export default function withAppContext(Component, appProps) {
    return function WrappedComponent(props) {
        return <Component {...props} {...appProps} />
    }
}
