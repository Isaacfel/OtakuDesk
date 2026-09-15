/**
 * Who runs the site, where, and how to reach them.
 *
 * The legal pages, the pick page's report link and the newsletter's postal
 * line all read from here, so a change of mailbox or address cannot leave a
 * stale copy behind on one page.
 *
 * Imported by the cron Worker as well as the site, so: plain constants, no
 * Next imports, no `@/` aliases.
 */
export const SITE = {
  name: 'Otakudesk',
  url: 'https://otakudesk.com',
  /** Trading name of the operator, a sole proprietorship in Texas. */
  legalName: 'Otakudesk',
  address: '617 Breckenridge Park Drive, Alvarado, TX 76009, United States',
  /** One mailbox for everything: general, privacy, listing reports, rights, sellers. */
  contactEmail: 'hello@otakudesk.com',
  jurisdiction: 'the State of Texas, United States',
} as const
