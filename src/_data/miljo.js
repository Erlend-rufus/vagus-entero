import { lesMiljo } from '../../verktoy/miljo-logikk.js';

// Bare det malene trenger. Basic-Auth-legitimasjonen holdes utenfor
// maldataene — den hører hjemme i _headers, ikke i noe en mal kan rendre.
export default function () {
  const miljo = lesMiljo();
  return {
    produksjon: miljo.produksjon,
    noindex: miljo.noindex,
    siteUrl: miljo.siteUrl,
    context: miljo.context,
    basicAuthAktiv: miljo.basicAuthAktiv
  };
}
