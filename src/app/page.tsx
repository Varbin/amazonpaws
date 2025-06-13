import Image from "next/image";
import styles from "./page.module.css";
import {PawPrint} from "@/types/pawPrint";
import PawTrack from "@/components/PawTrack";
import {getPrints} from "@/lib/data";

export default async function Home() {
  const prints: PawPrint[] = await getPrints();
  return (
      <>
        <PawTrack initialPrints={prints}/>
        <a className={styles.top} href="#">Back To Top</a>
      </>
  );
}
