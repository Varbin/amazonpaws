export interface Image {
    src: string;
    alt: string;
    caption: string;
}

export interface PawPrint {
    date: string;
    id: string;

    heading: string;
    text: string;

    image: Image|null;

    sources: string[];
    tags: string[];
}