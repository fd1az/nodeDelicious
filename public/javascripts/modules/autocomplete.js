function autocomplete(input,latInput,lngInput){
    if(!input) return;
    console.log(input,latInput,lngInput)
    const dropdown = new google.maps.places.Autocomplete(input);
    dropdown.addListener('place_changend',()=>{
        const place = dropdown.getPlace();
        console.log(place);
    })
}

export default autocomplete;