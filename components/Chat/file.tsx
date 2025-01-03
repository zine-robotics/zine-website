import React from 'react';
import {IFileBody} from "../../apis/interfaces/message"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

export function FileLink({ name, url, description }: IFileBody) {
    return (
        <a 
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-all hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <FontAwesomeIcon 
              icon={faFileAlt} 
              className="text-blue-500 text-xl"
            />
            <div className="flex-grow">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-blue-600">{name}</h3>
                <FontAwesomeIcon 
                  icon={faExternalLinkAlt} 
                  className="text-gray-400 text-sm"
                />
              </div>
              {description && (
                <p className="text-gray-600 text-sm mt-1">{description}</p>
              )}
            </div>
          </div>
        </a>
      );
    }