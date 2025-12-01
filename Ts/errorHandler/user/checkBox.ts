export function requiredCheck(lang: string): string{
    if(lang === "fr"){
        return "Cette case doit être cochée.";
    }else{
          return "This box must be checked.";
    }
}