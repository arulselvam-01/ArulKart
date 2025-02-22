import React from 'react'
import { ArulKart } from './arulKart'
import "./styles/app.css"
import { Footer } from './components/footer/Footer'

export const App = () => {
  return (
    <>
        <div className="app">
          
          <main>
            <ArulKart/>
            
          </main>

          <footer>
              <Footer/>
          </footer>
          

        </div>

    
    </>
  )
}
