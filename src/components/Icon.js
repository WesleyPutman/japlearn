import PropTypes from 'prop-types';

const Icon = ({ name, fill, stroke, width = "30", height = "30", ...props }) => {
    switch (name) {
        case 'home':
            return <svg {...props} width={width} height={height} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.66625 26.2501C6.19375 26.2501 5 25.0251 5 23.5126V12.5101C5 11.6789 5.36875 10.8914 6 10.3726L13.3337 4.3501C13.8023 3.96208 14.3916 3.74976 15 3.74976C15.6084 3.74976 16.1977 3.96208 16.6663 4.3501L23.9987 10.3726C24.6312 10.8914 25 11.6789 25 12.5101V23.5126C25 25.0251 23.8063 26.2501 22.3338 26.2501H7.66625Z M11.875 26.25V19.375C11.875 18.712 12.1384 18.0761 12.6072 17.6072C13.0761 17.1384 13.712 16.875 14.375 16.875H15.625C16.288 16.875 16.9239 17.1384 17.3928 17.6072C17.8616 18.0761 18.125 18.712 18.125 19.375V26.25" stroke={stroke ?? "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;

        case 'study':
            return <svg {...props} width={width} height={height} viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M28.1667 10.6251V16.8751M18.4379 4.37508C17.5719 3.964 16.6253 3.75073 15.6667 3.75073C14.708 3.75073 13.7614 3.964 12.8954 4.37508L4.53167 8.29632C2.71167 9.14882 2.71167 12.1013 4.53167 12.9538L12.8942 16.8751C13.7603 17.2863 14.7072 17.4997 15.666 17.4997C16.6249 17.4997 17.5717 17.2863 18.4379 16.8751L26.8017 12.9538C28.6217 12.1013 28.6217 9.14882 26.8017 8.29632L18.4379 4.37508Z M6.91667 14.375V20.7812C6.91667 24.4287 12.7842 26.25 15.6667 26.25C18.5492 26.25 24.4167 24.4287 24.4167 20.7812V14.375" stroke={stroke ?? "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;

        case 'profil':
            return <svg {...props} width={width} height={height} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 22.5C5 21.1739 5.52678 19.9021 6.46447 18.9645C7.40215 18.0268 8.67392 17.5 10 17.5H20C21.3261 17.5 22.5979 18.0268 23.5355 18.9645C24.4732 19.9021 25 21.1739 25 22.5C25 23.163 24.7366 23.7989 24.2678 24.2678C23.7989 24.7366 23.163 25 22.5 25H7.5C6.83696 25 6.20107 24.7366 5.73223 24.2678C5.26339 23.7989 5 23.163 5 22.5Z M15 12.5C17.0711 12.5 18.75 10.8211 18.75 8.75C18.75 6.67893 17.0711 5 15 5C12.9289 5 11.25 6.67893 11.25 8.75C11.25 10.8211 12.9289 12.5 15 12.5Z" stroke={stroke ?? "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;

        case 'kanji':
            return <svg {...props} width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.04956 14.41H20.9501M6.92406 8.27499H16.6336C17.2266 8.27499 17.3346 8.78149 16.9616 9.19349C15.5006 10.8095 13.5286 11.537 11.8086 11.938C11.3056 12.0555 11.3996 12.339 11.6216 12.5705C12.1106 13.0805 12.6536 13.7945 12.6536 15.0715V19.536C12.6536 20.6205 11.8466 21.2575 10.8756 21.2575C10.0086 21.2575 9.26056 21.0755 8.27406 20.57M12.0041 2.74249V4.77449M3.51006 8.16199V5.57099C3.50993 5.46659 3.53036 5.36319 3.57019 5.26668C3.61002 5.17018 3.66847 5.08246 3.7422 5.00855C3.81593 4.93463 3.9035 4.87596 3.9999 4.83589C4.09631 4.79582 4.19966 4.77512 4.30406 4.77499H19.7051C20.1441 4.77499 20.5001 5.12999 20.5001 5.56949V8.13349" stroke={stroke ?? "black"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;

        case 'hiragana':
            return <svg {...props} width={width} height={height} viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M516.207 300C518.53 315.042 517.063 334.557 511.983 356.693M511.983 356.693C488.233 460.123 385.49 620.777 221.084 649.73C221.084 649.73 176.147 659.34 151.422 634.09C109.399 591.17 113.755 477.61 467.36 366.717C481.867 362.167 496.917 358.8 511.983 356.693ZM511.983 356.693C653.75 336.86 796.633 428.747 495.86 700M251.042 200C300 200 433.333 183.333 517.84 166.667M384.353 100C350 233.333 316.667 350 384.353 633.333" stroke={stroke ?? "white"} strokeWidth="50" strokeLinecap="round" strokeLinejoin="round"/></svg>;

        case 'flashcards':
            return <svg {...props} width={width} height={height} viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M33.8333 7H6.75V34.0833H33.8333V7Z M33.8333 17.4165H44.25V44.4998H17.1667V34.0832" stroke={stroke ?? "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
         case 'toriGate':
            return <svg {...props} width={width} height={height} viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.75 27.8332H25.5M25.5 27.8332H44.25M25.5 27.8332V19.4998M10.9167 44.4998V19.4998M40.0833 44.4998V19.4998M6.75 8.0415V17.8332C6.75 18.4166 6.75 18.7083 6.86354 18.9311C6.9634 19.1271 7.12275 19.2864 7.31875 19.3863C7.54158 19.4998 7.83327 19.4998 8.41667 19.4998H42.5833C43.1667 19.4998 43.4583 19.4998 43.6812 19.3863C43.8773 19.2864 44.0367 19.1271 44.1365 18.9311C44.25 18.7083 44.25 18.4166 44.25 17.8332V8.0415C44.25 8.0415 35.9167 11.1665 25.5 11.1665C15.0833 11.1665 6.75 8.0415 6.75 8.0415Z" stroke={stroke ?? "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
        }
}

export default Icon;

Icon.propTypes = {
    name: PropTypes.string,
    fill: PropTypes.string,
    stroke: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string
}