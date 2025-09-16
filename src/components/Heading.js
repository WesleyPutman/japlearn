import PropTypes from 'prop-types';

const Heading = ({ children, className, level, tag, underline,  ...props}) => {
    let Balise = 'h' + level
    let style = 'mb-6 mt-4 font-bold'
    let underlineStyle = ''

    if (tag) {Balise = tag}

    if (underline && level === '2') {
        underlineStyle = 'relative after:content-[\'\'] after:w-24 after:absolute after:h-1 after:bg-red-500 after:bottom-[-8px] after:rounded-sm after:left-0';
    }

    switch (level) {
        case '1':
            style = 'text-[28px] font-bold';
            break;
        case '2':
            style = 'text-[24px] font-bold mb-6 mt-2';
            break;
        case '3':
            style = 'text-[18px] font-bold mb-6 mt-2';
            break;
        case '4':
            style = 'text-[16px] font-bold mb-6 mt-2';
            break;
        default: false
    }
    return <Balise {...props} className={`${style} ${underlineStyle} ${className ?? ''}`} >{children}</Balise>
}

export default Heading

Heading.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    tag: PropTypes.string,
    level: PropTypes.string,
    underline: PropTypes.bool,
}