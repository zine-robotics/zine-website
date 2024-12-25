const URL_REGEX = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;

export const urlComponent = (str: string) =>{
    return (
        <p>
            {str.split(/\s+/g).map((word) =>
                word.match(URL_REGEX) ? (
                <>
                    <a href={word} className="text-blue-500 underline" target="_blank">
                    {word}
                    </a>{" "}
                </>
                ) : (
                word + " "
                )
            )}
        </p>
    ) 
}