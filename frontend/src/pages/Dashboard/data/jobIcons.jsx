import {
  MdConstruction, MdElectricBolt, MdPlumbing,
  MdFormatPaint, MdBuild, MdHandyman, MdWork,
} from 'react-icons/md';

const JOB_ICONS = {
  construction: MdConstruction,
  electric:     MdElectricBolt,
  plumbing:     MdPlumbing,
  painting:     MdFormatPaint,
  masonry:      MdBuild,
  welding:      MdHandyman,
};

export const JobIcon = ({ iconKey, size = 22 }) => {
  const Icon = JOB_ICONS[iconKey] || MdWork;
  return <Icon size={size} />;
};
