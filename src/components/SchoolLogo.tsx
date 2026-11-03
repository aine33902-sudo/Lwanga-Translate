export const SCHOOL_CREST_URL = 'https://stcharleslwangassskibiri.ac.ug/users/87/7-2026/6a44f5fac4c30.png';

export default function SchoolLogo({ width = 66, height = 56 }: { width?: number; height?: number }) {
  return <img src={SCHOOL_CREST_URL} alt="St. Charles Lwanga school crest" width={width} height={height} onError={event => {
    if (!event.currentTarget.src.endsWith('/school-crest.svg')) event.currentTarget.src = `${import.meta.env.BASE_URL}school-crest.svg`;
  }} />;
}