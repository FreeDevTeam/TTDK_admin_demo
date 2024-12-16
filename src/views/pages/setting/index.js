import React, { memo, useEffect, useState } from 'react';
import Slider from "react-slick";
import { injectIntl, FormattedMessage, useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import "./index.scss";
import UploadImage from './UploadImage';
import AspectRatio from 'react-aspect-ratio';
import SystemConfigurationsService from '../../../services/SystemConfigurationsService';

const SlideImages = () => {
  const [setting, setSetting] = useState({});
  const intl = useIntl();

  const settingSilde = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    appendDots: dots => (
      <div style={{ bottom: '10px' }}>
        <ul style={{ margin: "0px", paddingLeft: "10px" }} className='d-flex justify-content-start align-items-end'> {dots} </ul>
      </div>
    ),
    customPaging: i => (
      <div className="slick-dot"></div>
    )
  };

  const fetchData = () => {
    const clearBannerUrls = (banners) => {
      for (let i = 1; i <= 5; i++) {
        const key = `bannerUrl${i}`;
        const value = `banner${i}`;
        if (banners[key] === value) {
          banners[key] = "";
        }
      }
      return banners;
    };

    SystemConfigurationsService.getPublicSystemConfigurations({}).then((res) => {
      setSetting(clearBannerUrls(res));
    })
  }

  const handleUpload = (url, index) => {
    const key = `bannerUrl${index}`;
    const newSetting = {
      [key]: url
    }

    SystemConfigurationsService.updateById({
      data: {
        ...newSetting
      }
    }).then((res) => {
      if (res.isSuccess) {
        fetchData();
      } else {
        toast.warn(intl.formatMessage({ id: 'upload_Error' }))
      }
    });
  }

  useEffect(() => {
    fetchData()
  }, []);
  return (
    <div className="slider-container">
      <h3 className="slider-title text-center title-normal">
        <FormattedMessage id="setting_title" />
      </h3>
      <p className='text-center text-small'>
        <FormattedMessage id="setting_description" />
      </p>
      <Slider {...settingSilde}>
        <div className="slide">
          <img src={setting.bannerUrl1 || process.env.PUBLIC_URL + "/image/NoImage.jpg"} alt="Slide 1" />
        </div>
        <div className="slide">
          <img src={setting.bannerUrl2 || process.env.PUBLIC_URL + "/image/NoImage.jpg"} alt="Slide 2" />
        </div>
        <div className="slide">
          <img src={setting.bannerUrl3 || process.env.PUBLIC_URL + "/image/NoImage.jpg"} alt="Slide 3" />
        </div>
        <div className="slide">
          <img src={setting.bannerUrl4 || process.env.PUBLIC_URL + "/image/NoImage.jpg"} alt="Slide 4" />
        </div>
        <div className="slide">
          <img src={setting.bannerUrl5 || process.env.PUBLIC_URL + "/image/NoImage.jpg"} alt="Slide 5" />
        </div>
      </Slider>
      <UploadImage setting={setting} onUpdate={handleUpload} />
    </div>
  );
};

export default injectIntl(memo(SlideImages));
