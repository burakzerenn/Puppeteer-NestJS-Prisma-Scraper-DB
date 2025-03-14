export interface StockDataExchanges {
    sembol: string;
    son: string;
    farkYuzde: string;
    fark: string;
    alis: string;
    satis: string;
    gYuksek: string;
    gDusuk: string;
    aOrt: string;
    adet: string;
    hacim: string;
    sure?: string;
  }

  export interface StockDataFunds {
    sembol: string;
    son: string;
    farkYuzde: string;
    haftaBasiYuzde: string;
    ayBasiYuzde: string;
    yilBasiYuzde: string;
    tedAdet: string;
    yatirimciSayisi: string;
    toplamDeger: string;
    portfoyDegeri: string;
    sure?: string;
}
  