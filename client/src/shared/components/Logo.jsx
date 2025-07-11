import logo from '../../assets/logo/TrendTubeLogo.svg';

function Logo({ width = "100px" }) {
  return (
    <div className="flex items-center">
      <img
        src={logo}
        alt="TrendTube Logo"
        style={{ width }}
        className="h-auto"
      />
    </div>
  );
}

export default Logo;
