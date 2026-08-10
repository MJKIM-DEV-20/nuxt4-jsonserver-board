// API = "http://localhost:4100"


export async function getList() {
    const response = await fetch("http://localhost:4100/posts",
        {
            method: 'GET',
        });
    const data = await response.json();
    console.log(data)
}


// export  async function CreateData(){
//     const response = await fetch("http://localhost:4100/write", {
//     method: "POST",
//     headers: {
//         "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//         title: "Test",
//         comment: "3회",
//         Id: 1,
//         author:"작성자",
//         content: "I am testing!",
//         date: new Date(),
//         type:"일반",
//         inquries:"35회",
//     }),
//     })
//     .then((response) => response.json())
//     .then((data) => console.log(data));
//         return response.json();
//     }
//
//
//     async function UpdateData(){
//
//
//
//
//     }
//
// export async function deleteItem(id) {
//     const res = await fetch(`http://localhost:4100/posts/:id`, {
//         method: 'DELETE',
//     });
//     return res.ok;
// }