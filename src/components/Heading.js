import PropTypes from 'prop-types';

const Heading = ({ children, className, level, tag, ...props}) => {
    let Balise = 'h' + level
    let style = ''

    if (tag) {Balise = tag}

    switch (level) {
        case '1':
            style = 'text-[28px] font-bold';
            break;
        case '2':
            style = 'text-[24px] font-bold';
            break;
        case '3':
            style = 'text-[18px] font-bold';
            break;
        case '4':
            style = 'text-[16px] font-bold';
            break;
        default: false
    }
    return <Balise {...props} className={`${style} ${className ?? ''}`} >{children}</Balise>
}

export default Heading

Heading.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    tag: PropTypes.string,
    level: PropTypes.string,
}