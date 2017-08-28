export default function(date) {
   return [
      date.getDate(),
      date.getMonth() + 1,
      String(date.getFullYear()).slice(-2)
   ].join('.');
}