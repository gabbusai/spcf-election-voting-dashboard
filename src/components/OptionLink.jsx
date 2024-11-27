import React from 'react';
import { motion } from 'framer-motion'; // Make sure this import is correct
import { useNavigate } from 'react-router-dom';

function OptionLink({ Icon, title, selected, setSelected, notifs, routeLink, open }) {
  const navigate = useNavigate(); // Correct usage of useNavigate

  const handleOptionClick = (path, title) => {
    setSelected(title);
    navigate(path); // Use the navigate function directly here
  };

  return (
    <motion.button
      layout
      className={`relative flex h-10 w-full items-center rounded-md transition-colors ${
        selected === title ? 'bg-indigo-100 text-indigo-800' : 'text-slate-500 hover:bg-slate-100'
      }`}
      onClick={() => handleOptionClick(routeLink.path, title)}
    >
      <motion.div layout className="grid h-full w-10 place-content-center text-lg">
        {Icon}
      </motion.div>
      {open && (
        <motion.span
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.125 }}
          className="text-xs font-medium"
        >
          {title}
        </motion.span>
      )}
    </motion.button>
  );
}

export default OptionLink;
