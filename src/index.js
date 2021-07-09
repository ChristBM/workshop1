const urlBase = 'https://platzi-avo.vercel.app' /* url de la API a consumir */

/* Leyendo el contenedor padre de la aplicación y asignandole la clase */
const appNode = document.querySelector('#app')
appNode.className = 'padre__app selectDisable'

/* objeto que contiene los atributos de cada elemento de la API */
const atributos = []
const resum = document.createElement('p')

/* Contador del carrito de compras */
let contar = 0
const contador = document.querySelector('.contador')
contador.textContent = `${contar}`

/* Agregandole un evento cuando posicione el mouse sobre la imagen, opaca imagen
muestra el texto de descripción y detiene el efecto de borde */
appNode.addEventListener( "mouseover", event => {
        if( event.target.className === 'imagen__aguacate' || event.target.className === 'imagen__aguacate opaco' ){
            event.target.className = 'imagen__aguacate'
            const spanes = event.path[1].querySelectorAll('span')
            const arraySpanes = [...spanes]
            arraySpanes.forEach( element => {
                element.classList.toggle('pause__animation')
            })
            atributos.forEach( elem => {
                if( `${event.target.src}` === `${urlBase}${elem.imag}`){
                    resum.textContent = elem.desc.description
                    resum.className = 'parrafito'
                    event.path[1].append(resum)
                    event.path[0].classList.add('opaco')
                }
            })
        }
        event.stopPropagation()
})

/* Agregandole un evento para cuando retire el mouse de la imagen, le quita la
opacidad a la imagen, remueve el nodo que muestra el texto de la descripcion y
vuelve el efecto del borde */
appNode.addEventListener( "mouseout", event => {
        if( event.target.className === 'imagen__aguacate' || event.path[0] === resum || event.target.className === 'imagen__aguacate opaco'){
            event.target.className = 'imagen__aguacate'
            const spanes = event.path[1].querySelectorAll('span')
            const arraySpanes = [...spanes]
            arraySpanes.forEach( element => {
                element.classList.toggle('pause__animation')
            })
            const imageAVO = event.path[1].querySelector('.imagen__aguacate')
            imageAVO.classList.remove('opaco')
            resum.remove()
        }
        event.stopPropagation()
})

/* Evento click para agragar el tipo de aguacate al carrito */
appNode.addEventListener( "click", event => {
    if( event.target.className === 'precio' ){
        if(event.target.className === 'precio'){
            if( event.target.style.backgroundColor === 'rgb(153, 221, 200)' ){
                event.target.style.backgroundColor =  '#95BF74'
                contar --
                contador.textContent = `${contar}`
            }
            else
            {
                event.target.style.backgroundColor =  '#99DDC8'
                contar += 1
                contador.textContent = `${contar}`
            }
        }
    }
})

/* Con esta API de internaconalización puedo trabajar mas comodamente con los precios */
function formatPrice(price) {

    const newPrice = new window.Intl.NumberFormat('en-EN', {
        style: 'currency',
        currency: 'USD'
    }).format(price)

    return newPrice
}

/* Esta es la función encargada de hacer la petición a la API y regresarme la información */
async function fetchAvo() {
    try{
        const response = await fetch(`${urlBase}/api/avo`)
        const dataJSON = await response.json()
        const nodos = []
        dataJSON.data.forEach( element => {
            /* imagen */
            const imagen = document.createElement('img')
            imagen.src = `${urlBase}${element.image}`
            imagen.className = 'imagen__aguacate'

            /* nombre */
            const nombre = document.createElement('h2')
            nombre.textContent = element.name
            nombre.className = 'nombre'

            /* precio */
            const precio = document.createElement('div')
            precio.textContent = formatPrice( element.price )
            precio.className = 'precio'
            precio.title = 'Presione aquí para agregar o quitar este tipo de aguacate al carrito'

            /* Creando los 4 span */
            const span_arriba = document.createElement('span')
            span_arriba.className = 'spanarriba'
            const span_derecha = document.createElement('span')
            span_derecha.className = 'spanderecha'
            const span_abajo = document.createElement('span')
            span_abajo.className = 'spanabajo'
            const span_izquierda = document.createElement('span')
            span_izquierda.className = 'spanizquierda'

            /* contenedor padre */
            const padre = document.createElement('div')
            padre.className = 'card'
            padre.append( imagen, nombre, precio, span_arriba, span_derecha, span_abajo, span_izquierda )
            nodos.push(padre)

            /* atrubutos de cada elemento, este contiene la descrición */
            const imagdesc = {
                imag: element.image,
                desc: element.attributes
            }
            atributos.push(imagdesc)
        })
        appNode.append(...nodos)
    }
    catch{
        console.log(error)
    }
}

fetchAvo()