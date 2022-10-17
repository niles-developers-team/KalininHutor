export const readAsDataURL = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
            if (!reader.result || typeof reader.result !== 'string')
                return;

            const body = reader.result.substring(reader.result.indexOf(',') + 1);

            resolve(body);
        };
    });