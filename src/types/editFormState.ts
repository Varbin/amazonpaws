import {PawPrint} from "@/types/pawPrint";

export type EditFormState = {
    pawPrint?: PawPrint;
    error?: string;
    ok?: boolean;
}