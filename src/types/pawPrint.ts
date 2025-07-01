export interface Image {
    src: string;
    alt: string;
    caption: string;
}

export interface PawPrint {
    date: string;  // Event date
    id: string;  // ObjectID

    heading: string;
    text: string;

    image: Image|null;

    sources: string[];
    tags: string[];

    modifiedDate?: string;  // Last edited date.
}


export function PawPrintDate(print: PawPrint) {
    return new Date(parseInt(print.id.substring(0, 8), 16) * 1000).toISOString();
}