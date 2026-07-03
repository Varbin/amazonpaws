import {PawPrint} from "@/lib/types/pawPrint";

export type PostState = {
    pawPrint?: PawPrint;
    error?: string;
    ok?: boolean;
}