export const PATH = {
    HOME:'/',
    WRITE:'/write',
    POST:   (id:string | number)=>  `/posts/${id}`,
    EDIT: (id:string | number)=> `/posts/${id}/edit`,
    DELETE:(id:string | number)=> `/posts/${id}/delete`,
}