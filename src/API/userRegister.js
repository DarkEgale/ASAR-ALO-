


export const userRegister=async(candirals)=>{



    const res= await fetch('https://asar-alo.onrender.com/api/auth/register',{
        method:"POST",
        headers:{
            'content-type':'application/json'
        },
        body:JSON.stringify(candirals)
    })
    if(!res.ok){
       return console.log("Error during fetch")
    }
    

}