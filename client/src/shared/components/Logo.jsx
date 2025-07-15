import logo from '../../assets/logo/TrendTubeLogo.svg';

function Logo({ width = "100px", height ="100px", className="" }) {
  return (
    <div className={`flex items-center`}>
      <img
        src={logo}
        alt="TrendTube Logo"
        height = {height}
        width = {width}
        className={`w-${width} h-${height} ${className}`}
      />
    </div>
  );
}

export default Logo;
