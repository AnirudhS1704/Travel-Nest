import axios from "axios";
import { useState } from "react";

export default function PhotosUploader({addPhotos, onChange}) {

    const [photoLink, setPhotoLink] = useState("");

    async function addPhotoByLink(event) {
        event.preventDefault();
        await axios.post('/upload-by-link', {link: photoLink})
        .then(function (response) {
            
            alert("Photo added");
            alert(addPhotos);
            setPhotoLink("");
            onChange(prev=>{
              return [...prev, response.data];
            });
          });    
    }

    function uploadPhoto(event) {
        const files = event.target.files;
        const data = new FormData();    
        for (let i = 0; i < files.length; i++) {
            data.append('photos', files[i]);
        }
        
        axios.post("/upload", data, {headers: {'Content-type': 'multipart/form-data'}})
        .then(function (response) {
            const filenames = response.data;
            onChange(prev=>{
                return [...prev, ...filenames];
              });
        })
    }

    function removePhoto(fileName) {
        onChange([...addPhotos.filter(photo=> photo !== fileName)]);
    }

    function makeAsMainPhoto(event, filename) {
        event.preventDefault();
        const addPhotosWithoutSelected = [...addPhotos.filter(photo=> photo !== filename)];
        const newAddphotos = [filename, ...addPhotosWithoutSelected];
        onChange(newAddphotos);
    }

    return(
        <>
            <div className="flex gap-2">
                                <input placeholder="Add image using url ....jpg" className="border rounded-xl py-1 px-2 grow" value={photoLink} onChange={event =>setPhotoLink(event.target.value)}></input>
                                <button className="bg-gray-500 text-white border rounded-2xl px-2 py-1" onClick={addPhotoByLink}>Add photo</button>
                        </div>
                        <input type="file" multiple className="hidden"></input>
                        <div className="grid grid-cols-3 lg:grid-cols-6 md:grid-cols-4 gap-2">
                            {addPhotos.length > 0 && addPhotos.map(link1=>
                               (  <div className="h-32 mt-2 flex relative" key={link1}>
                                <img src={"https://travel-nest-xk58.onrender.com/uploads/"+link1} className="border rounded-2xl object-cover"></img>
                                <button onClick={()=>removePhoto(link1)} className="absolute right-1 bottom-1 text-white bg-black px-1 py-2 bg-opacity-50 rounded-2xl">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
</svg>
                                </button>

                                <button onClick={(event)=>makeAsMainPhoto(event, link1)} className="absolute left-1 bottom-1 text-white bg-black px-1 py-2 bg-opacity-50 rounded-2xl">
                                    {link1 === addPhotos[0]&&(
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
</svg>
                                    )}
  {link1 !== addPhotos[0] && (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
</svg>)  
}                           

                                </button>
                               </div>)
                            )}
                        <label className="h-32 border bg-transparent rounded-2xl p-4 mt-2 flex justify-center text-lg bg-gray-500 gap-2 cursor-pointer">
                            <input type="file" className="hidden" onChange={uploadPhoto}></input>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 justify-center">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                        </svg>
                        <p className="mt-2 justify-center text-lg font-semibold text-black">Upload</p>
                        </label>
            </div>
        </>
    )
}