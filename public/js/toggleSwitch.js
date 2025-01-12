const taxToggle = document.querySelector(".tax-toggle");
const taxSwitch = document.querySelector("#flexSwitchCheckDefault");
const taxLabel = document.querySelector(".form-check-label");

taxToggle.addEventListener("click", (event)=>{
    taxSwitch.click();
});
taxLabel.addEventListener("click", ()=>{
    taxSwitch.click();
})
const taxInfo = document.querySelectorAll(".tax-info");
taxSwitch.addEventListener("click", (event)=>{
    event.stopPropagation();
    for(tax of taxInfo) {
        if(tax.style.display === "inline") tax.style.display = "none";
        else tax.style.display = "inline";
    }
});