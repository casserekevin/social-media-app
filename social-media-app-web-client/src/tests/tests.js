const printer = (value) => {
    console.log(value) 
}

const robo = (size) => {

    //cria a máquina para uma pedra específica
    let func_params = ''
    for(let i = 0; i < size; i++){
        if(i < size - 1){
            func_params = func_params + `param_${i + 1},`
        }
        else{
            func_params = func_params + `param_${i + 1}`
        }
    }

    let func_body = ''
    for(let i = 0; i < size; i++){
        func_body = func_body + `dispatch(param_${i + 1});`
    }

    let new_func = new Function('dispatch', `return (${func_params}) => {${func_body}}`)
    new_func = new_func(printer)
    // acaba aqui


    return new_func

}

//usa o robo
const maquina_1 = robo(3)
const maquina_2 = robo(5)

maquina_1('característica 1', 'característica 2', 'característica 3')

maquina_2('coisa_1', 'coisa_2', 'coisa_3', 'coisa_4', 'coisa_5')

