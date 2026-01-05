'use client';
import { useState, useLayoutEffect, JSX } from 'react';
import { createPortal } from 'react-dom';

interface PortalModalProps {
  children: JSX.Element;
  wrapperId: string;
}

export const PortalModal = ({
  children,
  wrapperId,
}: PortalModalProps): React.ReactPortal | null => {
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    let element = document.getElementById(wrapperId);
    let portalCreated = false;

    if (!element) {
      element = createWrapperAndAppendToBody(wrapperId);
      portalCreated = true;
    }

    setPortalElement(element);

    return () => {
      if (element && portalCreated && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [wrapperId]);

  const createWrapperAndAppendToBody = (elementId: string): HTMLDivElement => {
    const element = document.createElement('div');
    element.setAttribute('id', elementId);
    document.body.appendChild(element);
    return element;
  };
  if (!portalElement) return null;

  return createPortal(children, portalElement);
};
