const Footer = () => {
  return (
    <footer className="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4">
      <p>
        &copy; {new Date().getFullYear()} CollabBook | For you and your friends
      </p>
    </footer>
  );
};
export default Footer;
