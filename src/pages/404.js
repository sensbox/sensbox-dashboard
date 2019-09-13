import React, { PureComponent } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

export default class Index extends PureComponent {
  render() {
    return (
      <div
        style={{
          minHeight: 'calc(100vh - 500px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Helmet title="Not Found" />
        <div
          style={{
            maxWidth: '560px',
            backgroundColor: '#fff',
            padding: '80px 30px',
            margin: '100px auto',
            borderRadius: '10px',
            flex: '1',
          }}
        >
          <div
            style={{
              maxWidth: '400px',
              margin: '0 auto',
            }}
          >
            <h1 className="font-size-36 mb-2">Oops! Página no encontrada.</h1>
            <p className="mb-3">La página está desactualizada o quizas no existe!</p>
            <h1 className="font-size-80 mb-4 font-weight-bold">404 —</h1>
            <Link to="/" className="btn">
              &larr; Volver a la página de Inicio
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
