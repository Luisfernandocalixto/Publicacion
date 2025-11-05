
import { ArrowLeftIcon, ArrowRightIcon } from '/js/components/icons.js';
import { generatePagination } from '/js/lib/utils.js';

export const createPageURL = (page) => {    
   const params = new URLSearchParams(window.location.search);
   params.set('page', page.toString());
   return `?${params.toString()}`;
 }
   
   
   
export function Pagination({ totalPages }) {
  const searchParams = new URLSearchParams(window.location.search);
  const currentPage = Number(searchParams.get('page')) || 1
  const allPages = generatePagination(currentPage, totalPages);
  

  return `
      <div class="is-inline-flex">
       <div > ${PaginationArrow({ direction: 'left', href: createPageURL(currentPage - 1), isDisabled: currentPage <= 1 })} </div>
        <div class="is-flex is-space-x-px">
          ${allPages.map((page, index) => {
    let position = 'first' | 'last' | 'single' | 'middle' | undefined;

    if (index === 0) position = 'first'
    if (index === allPages.length - 1) position = 'last'
    if (allPages.length === 1) position = 'single'
    if (page === '...') position = 'middle'

    return `<div>${PaginationNumber({ key: page, href: createPageURL(page), page: page, position: position, isActive: currentPage === page })}</div>`
  }).join('')}
        </div>
        <div> ${PaginationArrow({ direction: 'right', href: createPageURL(currentPage + 1), isDisabled: currentPage >= totalPages })} </div>
      </div>

    
          `;  
}

function PaginationNumber({
  page,
  href,
  isActive,
  position,
}) {
  const className = `
  paginationNumberStyle is-flex is-button-page

    ${position === 'first' || position === 'single' ? 'is-rounded-l-md' : ''}
    ${position === 'last' || position === 'single' ? 'is-rounded-r-md' : ''}
    ${isActive ? 'is-z-10 color-green is-border-blue-600 is-text-white' : ''}
    ${!isActive && position !== 'middle' ? 'hover-bg-gray-100' : ''}
     ${position === 'middle' ? 'is-text-gray-300' : ''}
  `;

  return isActive || position === 'middle' ? `
  <div class="${className}">${page}</div>
  ` : `
    <button class="${className}" data-href="${href}">
      ${page}
    </button>
  `;
}

function PaginationArrow({ href, direction, isDisabled }) {
  function className({ isDisabled, direction }) {
    return (
      `
  paginationArrowStyle is-button-page
    ${isDisabled ? `is-pointer-events-none is-text-gray-300` : ``}
    ${!isDisabled ? `hover-bg-gray-100` : ``}
    ${direction == 'left' ? 'mr-2-md-mr-4' : ``}
    ${direction == 'right' ? 'ml-2-md-ml-4' : ``}
    `
    )


  }

  const isClassName = className({ isDisabled, direction })

  const icon = `
  ${direction === 'left' ? ArrowLeftIcon : ArrowRightIcon}`;

  return isDisabled ? `
  <div class="${isClassName}">${icon}</div>
  ` : `
  <button class="${isClassName}" data-href="${href}">
    ${icon}
  </button>
  `;
}
