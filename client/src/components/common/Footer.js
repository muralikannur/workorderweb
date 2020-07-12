import React, { PureComponent} from 'react';

class Footer extends PureComponent {
  render() {
    return(
      <footer className="footer">
          <div className="w-100 clearfix">
          <span className="text-muted d-block text-center text-sm-left d-sm-inline-block">Copyright © 2019 Essence. All rights reserved.</span>
          </div>
      </footer>
    )
  }
}

export default Footer;
