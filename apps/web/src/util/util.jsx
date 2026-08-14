export function TotalDate(isoString) {
    if (!isoString) return "";

    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const hours24 = date.getHours();
    const isPM = hours24 >= 12;
    const hours12 = hours24 % 12 || 12; // 0시 -> 12시로 보정

    return `${year}년 ${month}월 ${day}일 ${isPM ? "오후" : "오전"} ${hours12}시`;
}

export function detailDate(isoString) {
    if (!isoString) return "";

    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const hours24 = date.getHours();
    const isPM = hours24 >= 12;
    const hours12 = hours24 % 12 || 12; // 0시 -> 12시로 보정

    return `${year}년 ${month}월 ${day}일`;
}